function NoticeForm({ title, message, setTitle, setMessage, onSubmit }) {
    return (
        <div className="glass-box p-6 rounded-2xl">

        <h2 className="text-xl font-bold mb-4">Create Notice</h2>
  
        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
  
        <textarea
          className="w-full border p-3 rounded mb-3"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
  
        <button
          onClick={onSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl w-full font-semibold"
        >
          Add Notice
        </button>
      </div>
    );
  }
  
  export default NoticeForm;
  