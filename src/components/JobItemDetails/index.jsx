import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const JobItemDetails = () => {
  const {id} = useParams() // CHANGED: replaces match.params
  const [status, setStatus] = useState(apiStatusConstants.loading)
  const [jobDetails, setJobDetails] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])

  useEffect(() => {
    getJobDetails()
  }, [id])

  const getJobDetails = async () => {
    setStatus(apiStatusConstants.loading)

    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (!response.ok) {
        setStatus(apiStatusConstants.failure)
        return
      }

      const data = await response.json()

      // CHANGED: normalize API data
      const formattedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        title: data.job_details.title,
        rating: data.job_details.rating,
        location: data.job_details.location,
        employmentType: data.job_details.employment_type,
        packagePerAnnum: data.job_details.package_per_annum,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills,
        lifeAtCompany: data.job_details.life_at_company,
      }

      setJobDetails(formattedJobDetails)
      setSimilarJobs(data.similar_jobs)
      setStatus(apiStatusConstants.success)
    } catch {
      setStatus(apiStatusConstants.failure)
    }
  }

  const renderLoader = () => (
    <div className="loader-container" data-testid="loader">
  <ThreeDots
    height="50"
    width="50"
    radius="9"
    color="#ffffff"
    ariaLabel="three-dots-loading"
  />
</div>



  )

  const renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={getJobDetails}>
        Retry
      </button>
    </div>
  )

  const renderSuccessView = () => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <>
        <Header />

        <div className="job-item-details-container">
          <div className="top-section">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />

            <div>
              <h1>{title}</h1>
              <p>⭐ {rating}</p>
            </div>
          </div>

          <div className="meta">
            <p>{location}</p>
            <p>{employmentType}</p>
            <p>{packagePerAnnum}</p>
          </div>

          <div className="description-section">
            <h2>Description</h2>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="visit-link"
            >
              Visit
            </a>
            <p>{jobDescription}</p>
          </div>

          <h2>Skills</h2>
          <ul className="skills-list">
            {skills.map(skill => (
              <li key={skill.name} className="skill-item">
                <img src={skill.image_url} alt={skill.name} />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>

          <h2>Life at Company</h2>
          <div className="life-at-company">
            <p>{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.image_url}
              alt="life at company"
            />
          </div>

          <h2>Similar Jobs</h2>
          <ul className="similar-jobs-list">
            {similarJobs.map(job => (
              <SimilarJobItem key={job.id} jobDetails={job} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  switch (status) {
    case apiStatusConstants.loading:
      return renderLoader()
    case apiStatusConstants.failure:
      return renderFailureView()
    case apiStatusConstants.success:
      return renderSuccessView()
    default:
      return null
  }
}

export default JobItemDetails
