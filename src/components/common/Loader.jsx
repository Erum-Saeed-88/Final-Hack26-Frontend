const Loader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-themePurple/20"></div>
      <div className="absolute inset-0 rounded-full border-4 border-themeDeepPink border-t-transparent animate-spin"></div>
    </div>
  </div>
);

export default Loader;