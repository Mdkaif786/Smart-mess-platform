// src/components/admin/DashboardHome.js
import GlassBox from "../ui/GlassBox";
import StatCard from "../ui/StatCard";

function DashboardHome({
  myMess,
  isMessApproved = false,
  enrolledCount = 0,
  presentCount = 0,
  pendingCount = 0,
  presentStudents = [],
  pendingRequests = [],
  onApprove = () => {},
  onReject = () => {},
  todayMenu = null,
}) {
    if (!myMess) {
      return (
        <GlassBox>
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              No Mess Found
            </h2>
    
            <p className="text-gray-600 mb-4">
              You have not created any mess yet.
            </p>
    
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">
                Please click on the <span className="font-semibold">“Manage Mess”</span> option
                on the left sidebar to create your mess.
              </p>
            </div>
          </div>
        </GlassBox>
      );
    }
  

  const hasTodayMenu =
    todayMenu && (todayMenu.lunch || todayMenu.dinner);

  const status = myMess.status || "pending";

  let statusLabel = "";
  let statusBadgeClass = "";
  let statusMessage = "";

  if (status === "approved") {
    statusLabel = "Approved";
    statusBadgeClass = "bg-green-100 text-green-800";
    statusMessage =
      "Your mess is approved and visible to students. They can see and join it.";
  } else if (status === "pending") {
    statusLabel = "Pending Approval";
    statusBadgeClass = "bg-yellow-100 text-yellow-800";
    statusMessage =
      "Your mess is pending approval by the super admin. Students cannot see or join this mess until it is approved.";
  } else if (status === "rejected") {
    statusLabel = "Rejected";
    statusBadgeClass = "bg-red-100 text-red-800";
    statusMessage =
      "Your mess request was rejected by the super admin. Please contact the platform owner or update the details and request again.";
  } else {
    statusLabel = status;
    statusBadgeClass = "bg-gray-100 text-gray-800";
    statusMessage = "";
  }

  const statusBox = (
    <GlassBox className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Mess Status
          </p>
          <div className="mt-1 inline-flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
        <div className="md:max-w-xl text-sm text-gray-700">
          {statusMessage}
        </div>
      </div>
    </GlassBox>
  );

  // If mess is NOT approved, show only status on the dashboard
  if (!isMessApproved) {
    return (
      <div>
        <h1 className="text-4xl font-extrabold mb-6">
          {myMess.name} Dashboard
        </h1>
        {statusBox}
      </div>
    );
  }

  // If approved, show full dashboard contents
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-6">
        {myMess.name} Dashboard
      </h1>

      {statusBox}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Enrolled Students" value={enrolledCount} />
        <StatCard title="Present Today" value={presentCount} />
        <StatCard title="Pending Requests" value={pendingCount} />
      </div>

      {/* Today's Menu */}
      <GlassBox className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Today's Menu</h2>

        {!hasTodayMenu ? (
          <p className="text-gray-600">
            Menu is not set for today.
          </p>
        ) : (
          <div className="space-y-2">
            {todayMenu.lunch && (
              <p>
                <span className="font-semibold">Lunch: </span>
                {todayMenu.lunch}
              </p>
            )}
            {todayMenu.dinner && (
              <p>
                <span className="font-semibold">Dinner: </span>
                {todayMenu.dinner}
              </p>
            )}
          </div>
        )}
      </GlassBox>

      {/* Present Today */}
      <GlassBox className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Students Present Today
        </h2>

        {presentStudents.length === 0 ? (
          <p className="text-gray-600">
            No attendance marked today.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {presentStudents.map((s) => (
                <tr key={s.student_id} className="border-b">
                  <td className="py-2">{s.student_name}</td>
                  <td>{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassBox>

      {/* Pending Requests */}
      <GlassBox>
        <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>

        {pendingRequests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between border-b pb-3"
              >
                {/* LEFT: student info */}
                <div>
                  <p className="font-semibold">{req.student_name}</p>
                  <p className="text-sm text-gray-500">
                    {req.email}
                  </p>
                </div>

                {/* RIGHT: action buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onApprove(req.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => onReject(req.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassBox>
    </div>
  );
}

export default DashboardHome;