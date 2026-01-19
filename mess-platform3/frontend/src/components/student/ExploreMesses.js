// src/components/student/ExploreMesses.js
import GlassBox from "../ui/GlassBox";

function ExploreMesses({
  messes,
  onRequestJoin,
  requestStatusMap = {},
}) {
  const renderAction = (messId) => {
    const status = requestStatusMap[messId];

    // No request yet -> default join button
    if (!status) {
      return (
        <button
          onClick={() => onRequestJoin(messId)}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold w-full"
        >
          Request to Join
        </button>
      );
    }

    // Pending -> show yellow pill
    if (status === "pending") {
      return (
        <div className="mt-4 bg-yellow-400 text-white px-4 py-2 rounded-lg text-center font-semibold">
          Pending
        </div>
      );
    }

    // Rejected -> show red label + "Request Again" button
    if (status === "rejected") {
      return (
        <div className="mt-4 space-y-2">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-center font-semibold">
            Rejected
          </div>
          <button
            onClick={() => onRequestJoin(messId)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold w-full"
          >
            Request Again
          </button>
        </div>
      );
    }

    // Approved -> show enrolled label
    if (status === "approved") {
      return (
        <div className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-center font-semibold">
          Enrolled
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-10">
        Explore Messes
      </h1>

      {messes.length === 0 ? (
        <p>No messes available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messes.map((m) => (
            <GlassBox key={m.id}>
              <h2 className="text-xl font-bold">{m.name}</h2>
              <p className="text-gray-600">{m.description}</p>
              <p className="text-sm text-gray-500">{m.location}</p>

              {renderAction(m.id)}
            </GlassBox>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExploreMesses;