import { Link } from "react-router-dom";

const PotrikaNotFound = () => {
  return (
    <div className="flex items-center justify-center border p-10">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Potrika Not Found
        </h1>
        <p className="mb-6 text-gray-600">
          The potrika you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PotrikaNotFound;
