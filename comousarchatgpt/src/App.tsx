import { Routes, Route } from 'react-router-dom'
import Form from './pages/Form'
import Preview from './pages/Preview'
import Success from './pages/Success'
import Error from './pages/Error'

function App() {
  return (
    <div className="min-h-screen bg-neutral text-text-gray">
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/preview/:sessionId" element={<Preview />} />
        <Route path="/success/:sessionId" element={<Success />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
