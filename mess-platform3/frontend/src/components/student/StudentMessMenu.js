// src/components/student/StudentMessMenu.js
import GlassBox from "../ui/GlassBox";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function StudentMessMenu({ menus = [] }) {
  if (!menus || menus.length === 0) {
    return (
      <div>
        <h1 className="text-4xl font-extrabold mb-6">
          Mess Menu
        </h1>
        <GlassBox>
          <p className="text-gray-600">
            No menu available. Either you are not enrolled in any mess
            or the admin has not set the menu yet.
          </p>
        </GlassBox>
      </div>
    );
  }

  // Group menus by mess
  const grouped = {};
  menus.forEach((row) => {
    if (!grouped[row.mess_id]) {
      grouped[row.mess_id] = {
        messId: row.mess_id,
        messName: row.mess_name,
        days: {},
      };
    }
    grouped[row.mess_id].days[row.day_of_week] = {
      lunch: row.lunch,
      dinner: row.dinner,
    };
  });

  const messList = Object.values(grouped);

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-6">
        Mess Menu
      </h1>

      <div className="space-y-8">
        {messList.map((mess) => (
          <GlassBox key={mess.messId} className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {mess.messName}
            </h2>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Day</th>
                  <th className="py-2">Lunch</th>
                  <th className="py-2">Dinner</th>
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => {
                  const dayMenu = mess.days[day] || {
                    lunch: "",
                    dinner: "",
                  };
                  const hasAny =
                    dayMenu.lunch || dayMenu.dinner;

                  return (
                    <tr key={day} className="border-b align-top">
                      <td className="py-2 font-semibold">
                        {DAY_LABELS[day]}
                      </td>
                      <td className="py-2 pr-4">
                        {dayMenu.lunch || (
                          <span className="text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        {dayMenu.dinner || (
                          <span className="text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </GlassBox>
        ))}
      </div>
    </div>
  );
}

export default StudentMessMenu;