import './App.css'
import EmployeeComponent from './components/EmployeeComponent'
import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import EmployeeLogin from './pages/EmployeeLogin'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import AddEmployee from './pages/AddEmployee'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ProtectedRoute from './components/ProtectedComponent'
import ListEmployeeComponent from './components/ListAllEmployeeComponent'
import UpdateEmployee from './pages/UpdateEmployee'
import Logout from './pages/Logout'
import EmployeeProfile from './pages/EmployeeProfile'
import EmployeeAttendance from './pages/EmployeeAttendance'
import EmployeeSalary from './pages/EmployeeSalary'
import SearchEmployeeComponent from './pages/SearchEmployee'
import LeaveManagement from './pages/LeaveManagement'
import AdminLeaveManagement from './pages/AdminLeaveManagement'
import AdminAttendance from './pages/AdminAttendance'
import AdminSalaryManagement from './pages/AdminSalaryManagement'
import EmployeeWorkLog from './pages/EmployeeWorkLog'
import AdminWorkLogView from './pages/AdminWorkLogView'
import AdminAssignTask from './pages/AdminAssignTask'
import AIAssistant from './components/AIAssistant'

function App() {

  return (
    <div className='app-container'>
      <BrowserRouter>
        <AIAssistant />
        <HeaderComponent />
        <div className='main-content'>
          <Routes>
          {/* <Route path='/' element={<ListEmployeeComponent/>}></Route>
        <Route path='/employees' element={<ListEmployeeComponent/>}></Route>
        <Route path='/add-employee' element={<EmployeeComponent/>}></Route>
        <Route path='/edit-employee/:id'element={<EmployeeComponent/>}></Route> */}
          <Route path='/' element={<EmployeeLogin />} />
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/register" element={<Register />} />


          <Route path="/admin-dashboard"
            element={
              <ProtectedRoute role="ADMIN"><AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/employees"
            element={
              <ProtectedRoute role="ADMIN">
                <ListEmployeeComponent />
              </ProtectedRoute>
            }
          />

          <Route path="/add-employee"
            element={
              <ProtectedRoute role="ADMIN">
                <AddEmployee />
              </ProtectedRoute>
            }
          />

          <Route path="/edit-employee/:id"
            element={
              <ProtectedRoute role="ADMIN">
                <UpdateEmployee />
              </ProtectedRoute>
            }
          />


          <Route path="/employee-dashboard"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee-profile"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeAttendance />
              </ProtectedRoute>
            }
          />

          <Route 
          path="/search"
           element={
           <ProtectedRoute role="ADMIN">
           <SearchEmployeeComponent />
           </ProtectedRoute>
           }
           />


          <Route
            path="/leaves"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <LeaveManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLeaveManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee-salary"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeSalary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/salaries"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminSalaryManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee-worklogs"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeWorkLog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/work-reports"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminWorkLogView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/assign-task"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminAssignTask />
              </ProtectedRoute>
            }
          />

          <Route path="/logout" element={<Logout />} />

          <Route path="*" element={<EmployeeLogin />} />

        </Routes>
        </div>
        <FooterComponent />
      </BrowserRouter>
    </div>
  )
}

export default App
