//Error message component to display error messages to users in a consistent manner.
export const Error = ({message}) => {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
                <span className="text-2xl mr-3">🚫</span>
                <div>
                    <p className="font-bold text-red-800">Error</p>
                    <p className="text-red-700">{message}</p>
                </div>
                
            </div>
        </div>
    )
}