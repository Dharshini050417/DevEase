export const Card = ({ children, className = "" }) => {
    return (
      <div className={`bg-gray-900 border border-white  shadow-lg p-6 ${className}`}>
        {children}
      </div>
    );
  };
  
  export const CardContent = ({ children, className = "" }) => {
    return (
      <div className={`p-4 ${className}`}>
        {children}
      </div>
    );
  };
  