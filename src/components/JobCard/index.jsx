import {Link} from 'react-router-dom'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props

  const {
    id,
    title,
    rating,
    companyLogoUrl,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails

  return (
    <li className="job-card">
      {/* 
        No router changes needed.
        Link works the same in React Router v6.
      */}
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />

          <div className="title-rating-container">
            <h1 className="job-title">{title}</h1>

            <div className="rating-container">
              <BsStarFill className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>

        <div className="job-details-container">
          <div className="icon-text">
            <IoLocationSharp />
            <p>{location}</p>
          </div>

          <div className="icon-text">
            <BsBriefcaseFill />
            <p>{employmentType}</p>
          </div>

          <p className="package">{packagePerAnnum}</p>
        </div>

        <hr className="divider" />

        <h2 className="description-heading">Description</h2>
        <p className="job-description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard
