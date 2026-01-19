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

const Jobs = ({employmentTypesList, salaryRangesList}) => {
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
  }, [])

  const getProfile = async () => {
    setProfileStatus(apiStatusConstants.loading)
    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch('/profile', {
        headers: {Authorization: `Bearer ${jwtToken}`},
      })

      if (!response.ok) throw new Error()

      const data = await response.json()
      const p = data.profile_details

      setProfileData({
        name: p.name,
        profileImageUrl: p.profile_image_url,
        shortBio: p.short_bio,
      })
      setProfileStatus(apiStatusConstants.success)
    } catch {
      setProfileStatus(apiStatusConstants.failure)
    }
  }

  const getJobs = async () => {
    setJobsStatus(apiStatusConstants.loading)
    const jwtToken = Cookies.get('jwt_token')

    const url = `/jobs?employment_type=${employmentTypes.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`

    try {
      const response = await fetch(url, {
        headers: {Authorization: `Bearer ${jwtToken}`},
      })

      if (!response.ok) throw new Error()

      const data = await response.json()

      setJobsList(
        data.jobs.map(job => ({
          id: job.id,
          title: job.title,
          rating: job.rating,
          companyLogoUrl: job.company_logo_url,
          location: job.location,
          employmentType: job.employment_type,
          packagePerAnnum: job.package_per_annum,
          jobDescription: job.job_description,
        })),
      )
      setJobsStatus(apiStatusConstants.success)
    } catch {
      setJobsStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getJobs()
  }, [employmentTypes, salaryRange])

  const renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <ThreeDots height="50" width="50" color="#ffffff" />
    </div>
  )

  return (
    <>
      <Header />
      <div className="jobs-route-container">
        <div className="filters-section">
          {profileStatus === apiStatusConstants.loading && renderLoader()}
          {profileStatus === apiStatusConstants.success && (
            <div className="profile-container">
              <img src={profileData.profileImageUrl} alt="profile" />
              <h1>{profileData.name}</h1>
              <p>{profileData.shortBio}</p>
            </div>
          )}
        </div>

        <div className="jobs-section">
          {jobsStatus === apiStatusConstants.loading && renderLoader()}
          {jobsStatus === apiStatusConstants.success &&
            jobsList.map(job => (
              <JobCard key={job.id} jobDetails={job} />
            ))}
        </div>
      </div>
    </>
  )
}

export default Jobs
