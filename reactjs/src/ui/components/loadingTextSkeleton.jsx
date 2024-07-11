const LoadingTextSkeleton = ({ classes="flex items-center w-full h-full" }) => {
    return (
        <div className={classes}>
            <div className="animate-pulse bg-slate-200 w-full h-1/2 rounded-full">
            </div>
        </div>
    );
}
 
export default LoadingTextSkeleton;