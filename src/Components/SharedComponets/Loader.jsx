
const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative w-16 h-16 mb-4">
       
        <div 
          className="absolute inset-0 rounded-full border-4 border-[#68b5c2] border-t-transparent animate-spin"
          style={{ animationDuration: '1s' }}
        ></div>
      
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#68b5c2] font-bold">HE</span>
        </div>
      </div>
      <p className="text-[#68b5c2] font-medium">Loading HomeEase services...</p>
    </div>
  );
};

export default Loader;