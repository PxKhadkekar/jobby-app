import {Routes, Route, Navigate} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

/* Same data as before, unchanged */
const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const App = () => (
  <Routes>
    {/* Login route (public) */}
    <Route path="/login" element={<LoginForm />} />

    {/* Home (protected) */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />

    {/* Jobs (protected, with props) */}
    <Route
      path="/jobs"
      element={
        <ProtectedRoute>
          <Jobs
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
          />
        </ProtectedRoute>
      }
    />

    {/* Job details (protected) */}
    <Route
      path="/jobs/:id"
      element={
        <ProtectedRoute>
          <JobItemDetails />
        </ProtectedRoute>
      }
    />

    {/* Not Found */}
    <Route path="/not-found" element={<NotFound />} />

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/not-found" replace />} />
  </Routes>
)

export default App
