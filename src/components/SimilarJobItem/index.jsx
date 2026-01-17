import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props

  const {
    title,
    rating,
    companyLogoUrl,
    location,
    employmentType,
    jobDescription,
  } = jobDetails

  return (
    <li className="similar-job-card">
      <img
        src={companyLogoUrl}
        alt="similar job company logo"
        className="company-logo"
      />

      <h1 className="job-title">{title}</h1>

      <div className="rating-container">
        <BsStarFill className="star-icon" />
        <p className="rating">{rating}</p>
      </div>

      <h2 className="description-heading">Description</h2>
      <p className="job-description">{jobDescription}</p>

      <div className="job-info">
        <div className="icon-text">
          <IoLocationSharp />
          <p>{location}</p>
        </div>

        <div className="icon-text">
          <BsBriefcaseFill />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
