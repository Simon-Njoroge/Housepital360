
interface ErrorProps {
    data: {
        message: string;
    }
}
function Error({data}: ErrorProps) {
  return (
    <div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{data.message}</span>
        </div>
        <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
        >
            Retry
        </button>
    </div>
  )
}

export default Error
