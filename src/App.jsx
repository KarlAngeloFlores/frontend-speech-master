import './App.css'

import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

/**All
 * @ALL_PAGES
 */
import ProtectedRoute from './components/protected/ProtectedRoute'

import AuthPage from './pages/AuthPage'
import ForgotPage from './pages/ForgotPage'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import PendingPage from './pages/PendingPage'

/**
 * @TRAINER_PAGES
 */
import TrainerHomePage from './pages/trainer/TrainerHomePage'
import TrainerQuizzesPage from './pages/trainer/TrainerQuizzesPage'
import TrainerModulePage from './pages/trainer/TrainerModulePage'
import TrainerTraineesPage from './pages/trainer/TrainerTraineesPage'


/**
 * @TRAINEES_PAGES
 */
import TraineeHomePage from './pages/trainee/TraineeHomePage'
import TraineeSpeechPracticePage from './pages/trainee/TraineeSpeechPracticePage'
import TraineeScoresPage from './pages/trainee/TraineeScoresPage'
import TraineeModulePage from './pages/trainee/TraineeModulePage'
import TraineeDictionaryPage from './pages/trainee/TraineeDictionaryPage'
import ShootTheWordPage from './pages/trainee/ShootTheWordPage'
import PronounceItFastPage from './pages/trainee/PronounceItFastPage'
import InteractPage from './pages/trainee/InteractPage'


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/forgot-password' element={<ForgotPage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />

        
          {/**
           * @TRAINER_PAGES
           */}
        <Route path='/trainer/home' element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerHomePage />
          </ProtectedRoute>} />

          <Route path='/trainer/quizzes' element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerQuizzesPage />
          </ProtectedRoute>} />

          <Route path='/trainer/modules' element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerModulePage />
          </ProtectedRoute>} />

          <Route path='/trainer/trainees' element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerTraineesPage />
          </ProtectedRoute>} />

          {/**
           * @TRAINEE_PAGES
           */}

          <Route path='/trainee/quizzes' element={
          <ProtectedRoute allowedRoles={["trainee"]}>
            <TraineeHomePage />
          </ProtectedRoute>} />

          <Route path='/trainee/quizzes-score' element={
          <ProtectedRoute allowedRoles={["trainee"]}>
            <TraineeScoresPage />
          </ProtectedRoute>} />

          <Route path='/trainee/speech-practice' element={
          <ProtectedRoute allowedRoles={["trainee"]}>
            <TraineeSpeechPracticePage />
          </ProtectedRoute>} />

          <Route path='/trainee/dictionary' element={
          <ProtectedRoute allowedRoles={["trainee"]}>
            <TraineeDictionaryPage />
          </ProtectedRoute>} />

          <Route path='/trainee/modules' element={
          <ProtectedRoute allowedRoles={["trainee"]}>
            <TraineeModulePage />
          </ProtectedRoute>} />

          <Route path='/trainee/pronounce-it-fast/:quiz_id' element = {
            <ProtectedRoute allowedRoles={["trainee"]}>
            <PronounceItFastPage />
          </ProtectedRoute>} />

          <Route path='/trainee/shoot-the-word/:quiz_id' element = {
            <ProtectedRoute allowedRoles={["trainee"]}>
              <ShootTheWordPage />
          </ProtectedRoute>} />

          <Route path='/trainee/interact' element = {
            <ProtectedRoute allowedRoles={["trainee"]}>
              <InteractPage />
          </ProtectedRoute>} />

          <Route path='/trainee/pending' element={<PendingPage/>}/>
          
      </Routes>

    </Router>
  )
}

export default App
