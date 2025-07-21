import { useState, useEffect } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { BsSearch } from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const Jobs = ({ employmentTypesList, salaryRangesList }) => {
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState([])
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('')
  const [jobsList, setJobsList] = useState([])
  const [profile, setProfile] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFailure, setIsFailure] = useState(false)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isProfileFailure, setIsProfileFailure] = useState(false)

  useEffect(() => {
    fetchJobs()
    fetchProfile()
    // eslint-disable-next-line
  }, [])

  const fetchProfile = async () => {
    setIsProfileLoading(true)
    setIsProfileFailure(false)
    const url = 'https://apis.ccbp.in/profile'
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
        const updatedProfile = {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        }
        setProfile(updatedProfile)
        setIsProfileLoading(false)
        setIsProfileFailure(false)
      } else {
        setIsProfileLoading(false)
        setIsProfileFailure(true)
      }
    } catch (error) {
      setIsProfileLoading(false)
      setIsProfileFailure(true)
    }
  }

  const fetchJobs = async () => {
    setIsLoading(true)
    setIsFailure(false)
    const employmentTypesQuery =
      selectedEmploymentTypes.length > 0
        ? selectedEmploymentTypes.join(',')
        : ''
    const salaryQuery = selectedSalaryRange || ''
    const searchQuery = searchInput || ''
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesQuery}&minimum_package=${salaryQuery}&search=${searchQuery}`
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
        const updatedJobs = data.jobs.map(job => ({
          id: job.id,
          title: job.title,
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
          jobDescription: job.job_description,
        }))
        setJobsList(updatedJobs)
        setIsLoading(false)
        setIsFailure(false)
      } else {
        setIsLoading(false)
        setIsFailure(true)
      }
    } catch (error) {
      setIsLoading(false)
      setIsFailure(true)
    }
  }

  const handleSearchInputChange = event => {
    setSearchInput(event.target.value)
  }

  const handleSearchRole = () => {
    fetchJobs()
  }

  const handleRetry = () => {
    fetchJobs()
  }

  const handleEmploymentTypeChange = event => {
    const { value, checked } = event.target
    setSelectedEmploymentTypes(prev =>
      checked ? [...prev, value] : prev.filter(id => id !== value)
    )
    setTimeout(fetchJobs, 0)
  }

  const handleSalaryRangeChange = event => {
    setSelectedSalaryRange(event.target.value)
    setTimeout(fetchJobs, 0)
  }

  return (
    <div className="job-page">
      <Header />
      <div className="job-container">
        <div className="side-bar">
          <div className="profile">
            {isProfileLoading ? (
              <div className="loader-container" data-testid="loader">
                <ThreeDots color="#ffffff" height={50} width={50} />
              </div>
            ) : isProfileFailure ? (
              <div className="failure-view">
                <button type="button" className="btn" onClick={fetchProfile}>
                  Retry
                </button>
              </div>
            ) : profile ? (
              <div className="profile-content">
                <img src={profile.profileImageUrl} alt="profile" className="profile-img" />
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-bio">{profile.shortBio}</p>
              </div>
            ) : null}
          </div>
          <hr />
          <div className="Employment">
            <h4 className="headings">Type of Employment</h4>
            <ul>
              {employmentTypesList.map(type => (
                <li key={type.employmentTypeId}>
                  <label>
                    <input
                      type="checkbox"
                      value={type.employmentTypeId}
                      checked={selectedEmploymentTypes.includes(type.employmentTypeId)}
                      onChange={handleEmploymentTypeChange}
                    />
                    {type.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div className="Salary Range">
            <h4 className="headings">Salary Range</h4>
            <ul className="radio-group">
              {salaryRangesList.map(range => (
                <li key={range.salaryRangeId}>
                  <label>
                    <input
                      type="radio"
                      name="salary"
                      value={range.salaryRangeId}
                      checked={selectedSalaryRange === range.salaryRangeId}
                      onChange={handleSalaryRangeChange}
                    />
                    {range.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="main-page">
          <div className="search-wrapper">
            <input
              type="search"
              placeholder="Search jobs"
              className="search-input"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={handleSearchRole}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
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
              <h1 className="failure-heading">Oops! Something Went Wrong</h1>
              <p className="failure-description">
                We cannot seem to find the page you are looking for
              </p>
              <button type="button" className="btn" onClick={handleRetry}>
                Retry
              </button>
            </div>
          ) : jobsList.length === 0 ? (
            <div className="no-jobs-view">
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                alt="no jobs"
                className="no-jobs-img"
              />
              <h1 className="no-jobs-heading">No Jobs Found</h1>
              <p className="no-jobs-description">
                We could not find any jobs. Try other filters.
              </p>
            </div>
          ) : (
            <ul className="jobs-list">
              {jobsList.map(job => (
                <JobItem key={job.id} job={job} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobs
