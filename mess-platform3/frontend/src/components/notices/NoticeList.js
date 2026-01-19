function NoticeList({ notices, onDelete }) {
    if (notices.length === 0) {
      return <p>No notices yet.</p>;
    }
  
    return (
      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className="glass-box p-6 rounded-xl shadow flex justify-between items-start"
          >
            <div>
              <h2 className="text-xl font-bold">{n.title}</h2>
              <p className="text-gray-600">{n.message}</p>
            </div>
  
            <button
              onClick={() => onDelete(n.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  }
  
  export default NoticeList;
  