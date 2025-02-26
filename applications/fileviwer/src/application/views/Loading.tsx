
const Loading = () => {

  return (
    <div className="flex justify-center items-center ">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-400"></div>
        {/* <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-500"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-600"></div> */}
      </div>
    </div>
  )
}

export default Loading