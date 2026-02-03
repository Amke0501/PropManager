//Loading will be used in various parts of the application to indicate that data is being fetched or processed.
export const Loading = () => {
    return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
        </div>
    )
}
