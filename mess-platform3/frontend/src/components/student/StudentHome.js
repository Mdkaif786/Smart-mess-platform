// src/components/student/StudentHome.js
import GlassBox from "../ui/GlassBox";

function StudentHome({
  studentName,
  approvedMesses = [],       // [{ id, name, todayMenu }, ...]
  onMarkAttendance,          // function(messId)
}) {
  const hasNoMess = approvedMesses.length === 0;

  return (
    <div>
      {/* Greeting */}
      <h1 className="text-4xl font-extrabold mb-8">
        Hello, {studentName}
      </h1>

      <GlassBox className="mb-10">
        {hasNoMess ? (
          <p className="text-gray-600">
            You are not enrolled in any mess yet. Go to{" "}
            <span className="font-semibold">Explore Messes</span> to request
            to join.
          </p>
        ) : (
          <>
            <p className="font-semibold mb-4">
              You are enrolled in the following messes:
            </p>

            <div className="space-y-4">
              {approvedMesses.map((mess) => {
                const hasTodayMenu =
                  mess.todayMenu &&
                  (mess.todayMenu.lunch || mess.todayMenu.dinner);

                return (
                  <div
                    key={mess.id}
                    className="flex items-start justify-between border-b pb-3 last:border-b-0 gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-blue-600">
                        {mess.name}
                      </p>

                      {hasTodayMenu && (
                        <div className="mt-1 text-sm text-gray-700 space-y-1">
                          {mess.todayMenu.lunch && (
                            <p>
                              <span className="font-semibold">
                                Lunch:{" "}
                              </span>
                              {mess.todayMenu.lunch}
                            </p>
                          )}
                          {mess.todayMenu.dinner && (
                            <p>
                              <span className="font-semibold">
                                Dinner:{" "}
                              </span>
                              {mess.todayMenu.dinner}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onMarkAttendance(mess.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
                    >
                      Mark Attendance
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-sm text-gray-500">
              You can mark attendance once per day for each mess you are
              enrolled in. If you try again for the same mess, you will
              see an error message.
            </p>
          </>
        )}
      </GlassBox>
    </div>
  );
}

export default StudentHome;