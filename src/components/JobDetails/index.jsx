import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { BsBriefcaseFill } from 'react-icons/bs'
import Header from '../Header'
import './index.css'
import { ThreeDots } from 'react-loader-spinner'

const JobDetails = () => {
  const { id } = useParams()
  const [jobDetails, setJobDetails] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFailure, setIsFailure] = useState(false)

  useEffect(() => {
    fetchJobDetails()
    // eslint-disable-next-line
  }, [id])

  const fetchJobDetails = async () => {
    setIsLoading(true)
    setIsFailure(false)
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MTk2Mjg2MTN9.nZDlFsnSWArLKKeF0QbmdVfLgzUbx1BGJsqa2kc_21Y',
      },
    }
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const job = data.job_details
        const updatedJobDetails = {
          id: job.id,
          title: job.title,
          companyWebsiteUrl: job.company_website_url,
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
          jobDescription: job.job_description,
          skills: job.skills.map(skill => ({
            name: skill.name,
            imageUrl: skill.image_url,
          })),
          lifeAtCompany: {
            description: job.life_at_company.description,
            imageUrl: job.life_at_company.image_url,
          },
        }
        const updatedSimilarJobs = data.similar_jobs.map(job => ({
          id: job.id,
          title: job.title,
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
          jobDescription: job.job_description,
        }))
        setJobDetails(updatedJobDetails)
        setSimilarJobs(updatedSimilarJobs)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setIsFailure(true)
      }
    } catch (error) {
      setIsLoading(false)
      setIsFailure(true)
    }
  }

  const renderSimilarJobs = () => (
    <div className="similar-jobs-section">
      <h3 className="similar-head">Similar Jobs</h3>
      <ul className="similar-jobs-list">
        {similarJobs.map(job => (
          <li key={job.id} className="similar-job-card">
            <div className="similar-job-header">
              <img
                src={job.companyLogoUrl}
                alt="similar job company logo"
                className="company-logo"
              />
              <div>
                <h4>{job.title}</h4>
                <p>★ {job.rating}</p>
              </div>
            </div>
            <p>{job.packagePerAnnum}</p>
            <h5>Description</h5>
            <p>{job.jobDescription}</p>
            <div className="similar-job-meta">
              <p>
                <MdLocationOn /> {job.location}
              </p>
              <p>
                <BsBriefcaseFill /> {job.employmentType}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderJobDetails = () => {
    if (!jobDetails) return null
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
      companyWebsiteUrl,
    } = jobDetails
    return (
      <>
        <div className="job-details-container">
          <div className="head-title">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1>{title}</h1>
              <p>★ {rating}</p>
            </div>
          </div>
          <div className="details">
            <div className="loc-type">
              <div className="location">
                <MdLocationOn />
                <p>{location}</p>
              </div>
              <div className="type">
                <BsBriefcaseFill />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description">
            <div className="desc">
              <h3>Description</h3>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="website-link"
              >
                Visit
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <div className="skills-section">
            <h3>Skills</h3>
            <ul className="skills-list">
              {skills.map(skill => (
                <li key={skill.name} className="skill-item">
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="skill-icon"
                  />
                  <p>{skill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company">
            <h3>Life at Company</h3>
            <div className="life-content">
              <p>{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-img"
              />
            </div>
          </div>
        </div>
        {renderSimilarJobs()}
      </>
    )
  }

  return (
    <div className="job-details-page">
      <Header />
      <div className="container">
        {isLoading ? (
          <div className="loader-container" data-testid="loader">
            <ThreeDots color="#ffffff" height={50} width={50} />
          </div>
        ) : isFailure ? (
          <div className="failure-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="failure-img"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We couldn’t fetch job details. Please try again.</p>
            <p>We cannot seem to find the page you are looking for</p>
            <button
              type="button"
              onClick={fetchJobDetails}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        ) : (
          renderJobDetails()
        )}
      </div>
    </div>
  )
}

export default JobDetails
