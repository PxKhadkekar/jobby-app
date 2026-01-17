import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'

import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Jobs = props => {
  const {employmentTypesList, salaryRangesList} = props

  const [profileStatus, setProfileStatus] = useState(apiStatusConstants.loading)
  const [jobsStatus, setJobsStatus] = useState(apiStatusConstants.loading)

  const [profileData, setProfileData] = useState({})
  const [jobsList, setJobsList] = useState([])

  const [searchInput, setSearchInput] = useState('')
  const [employmentTypes, setEmploymentTypes] = useState([])
  const [salaryRange, setSalaryRange] = useState('')

  useEffect(() => {
    getProfile()
    getJobs()
    // eslint-disable-next-line
  }, [])

  /* ---------- PROFILE API ---------- */

  const getProfile = async () => {
    setProfileStatus(apiStatusConstants.loading)

    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch('https://apis.ccbp.in/profile', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (!response.ok) {
        setProfileStatus(apiStatusConstants.failure)
        return
      }

      const data = await response.json()
      const profile = data.profile_details

      setProfileData({
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      })
      setProfileStatus(apiStatusConstants.success)
    } catch {
      setProfileStatus(apiStatusConstants.failure)
    }
  }

  /* ---------- JOBS API ---------- */

  const getJobs = async () => {
    setJobsStatus(apiStatusConstants.loading)

    const jwtToken = Cookies.get('jwt_token')
    const employmentTypeQuery = employmentTypes.join(',')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeQuery}&minimum_package=${salaryRange}&search=${searchInput}`

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (!response.ok) {
        setJobsStatus(apiStatusConstants.failure)
        return
      }

      const data = await response.json()

      const formattedJobs = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        location: job.location,
        employmentType: job.employment_type,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
      }))

      setJobsList(formattedJobs)
      setJobsStatus(apiStatusConstants.success)
    } catch {
      setJobsStatus(apiStatusConstants.failure)
    }
  }

  /* ---------- RENDER PROFILE ---------- */

  const renderProfile = () => {
    switch (profileStatus) {
      case apiStatusConstants.loading:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
          </div>
        )

      case apiStatusConstants.success:
        return (
          <div className="profile-container">
            <img src={profileData.profileImageUrl} alt="profile" />
            <h1>{profileData.name}</h1>
            <p>{profileData.shortBio}</p>
          </div>
        )

      case apiStatusConstants.failure:
        return (
          <button type="button" onClick={getProfile}>
            Retry
          </button>
        )

      default:
        return null
    }
  }

  /* ---------- RENDER JOBS ---------- */

  const renderJobs = () => {
    switch (jobsStatus) {
      case apiStatusConstants.loading:
        return (
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

      case apiStatusConstants.failure:
        return (
          <div className="jobs-failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button type="button" onClick={getJobs}>
              Retry
            </button>
          </div>
        )

      case apiStatusConstants.success:
        if (jobsList.length === 0) {
          return (
            <div className="no-jobs-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                alt="no jobs"
              />
              <h1>No Jobs Found</h1>
              <p>We could not find any jobs. Try other filters</p>
            </div>
          )
        }

        return (
          <ul className="jobs-list">
            {jobsList.map(job => (
              <JobCard key={job.id} jobDetails={job} />
            ))}
          </ul>
        )

      default:
        return null
    }
  }

  /* ---------- FILTER HANDLERS ---------- */

  const onChangeSearchInput = event => {
    setSearchInput(event.target.value)
  }

  const onClickSearch = () => {
    getJobs()
  }

  const onChangeEmploymentType = event => {
    const {value, checked} = event.target

    setEmploymentTypes(prev =>
      checked ? [...prev, value] : prev.filter(each => each !== value),
    )
  }

  const onChangeSalaryRange = event => {
    setSalaryRange(event.target.value)
  }

  /* ---------- EFFECT FOR FILTERS ---------- */
  useEffect(() => {
    getJobs()
    // eslint-disable-next-line
  }, [employmentTypes, salaryRange])

  return (
    <>
      <Header />

      <div className="jobs-route-container">
        <div className="filters-section">
          {renderProfile()}

          <div className="search-container">
            <input
              type="search"
              value={searchInput}
              onChange={onChangeSearchInput}
              placeholder="Search"
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={onClickSearch}
            >
              Search
            </button>
          </div>

          <h1>Type of Employment</h1>
          <ul className="filters-list">
            {employmentTypesList.map(type => (
              <li key={type.employmentTypeId}>
                <input
                  type="checkbox"
                  value={type.employmentTypeId}
                  onChange={onChangeEmploymentType}
                />
                <label>{type.label}</label>
              </li>
            ))}
          </ul>

          <h1>Salary Range</h1>
          <ul className="filters-list">
            {salaryRangesList.map(range => (
              <li key={range.salaryRangeId}>
                <input
                  type="radio"
                  name="salary"
                  value={range.salaryRangeId}
                  onChange={onChangeSalaryRange}
                />
                <label>{range.label}</label>
              </li>
            ))}
          </ul>
        </div>

        <div className="jobs-section">{renderJobs()}</div>
      </div>
    </>
  )
}

export default Jobs
