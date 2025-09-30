import { Loader2 } from "lucide-react"

const LoadingScreen = ({ message, size }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-blue-50 px-4 sm:px-6 lg:px-8">
      <Loader2 className={`${size || "h-6 w-6"} animate-spin`} />   
      <p>{message || "Loading..."}</p>
    </div>
  )
}

export default LoadingScreen