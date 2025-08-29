import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          🏀 Basketball Tournament - Rebuild Working!
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Phase 1: Foundation Setup ✅
          </h2>
          <p className="text-gray-700 mb-4">
            If you can see this styled page, Tailwind CSS is working correctly!
          </p>
          
          <button className="btn-primary mr-4">
            Primary Button
          </button>
          <button className="btn-secondary">
            Secondary Button
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">✅ Vite Setup</h3>
            <p className="text-green-700">React + TypeScript working</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">✅ Tailwind CSS</h3>
            <p className="text-blue-700">Styling system active</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">🔄 Next: Components</h3>
            <p className="text-orange-700">Copy existing UI components</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App