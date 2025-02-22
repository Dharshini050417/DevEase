export function Avatar({ src, alt = "User Avatar", className = "" }) {
    return (
      <img
        src={src || "https://via.placeholder.com/40"}
        alt={alt}
        className={`w-10 h-10 rounded-full border border-gray-300 shadow-sm ${className}`}
      />
    );
}