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
  const {id} = useParams()
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
      const response = await fetch(`/jobs/${id}`, {
        headers: {Authorization: `Bearer ${jwtToken}`},
      })

      if (!response.ok) throw new Error()

      const data = await response.json()
      setJobDetails(data.job_details)
      setSimilarJobs(data.similar_jobs)
      setStatus(apiStatusConstants.success)
    } catch {
      setStatus(apiStatusConstants.failure)
    }
  }

  if (status === apiStatusConstants.loading) {
    return (
      <div className="loader-container" data-testid="loader">
        <ThreeDots height="50" width="50" color="#ffffff" />
      </div>
    )
  }

  if (status === apiStatusConstants.failure) {
    return <p style={{color: 'white'}}>Failed to load</p>
  }

  return (
    <>
      <Header />
      <div className="job-item-details-container">
        <h1>{jobDetails.title}</h1>
        <ul>
          {similarJobs.map(job => (
            <SimilarJobItem key={job.id} jobDetails={job} />
          ))}
        </ul>
      </div>
    </>
  )
}

export default JobItemDetails
