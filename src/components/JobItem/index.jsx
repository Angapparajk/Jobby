import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = job
  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="job-item">
        <div className="title">
          <img src={companyLogoUrl} alt="company logo" />
          <div className="role">
            <h4>{title}</h4>
            <div className="rating">
              <FaStar className="icon" />
              <p>{rating}</p>
            </div>
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
        <h3>Description</h3>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
