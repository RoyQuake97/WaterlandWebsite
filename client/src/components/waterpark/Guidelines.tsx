const Guidelines = () => {
  return (
    <div className="bg-[#f5f1e9] rounded-lg p-6 md:p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-[#0a4b78] mb-4 font-montserrat">Park Guidelines</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start">
          <i className="fas fa-utensils text-[#6dcf94] text-2xl mr-3"></i>
          <div>
            <h4 className="font-bold text-[#0a4b78] mb-1">Food & Drinks</h4>
            <p className="text-gray-600">No outside food or drinks allowed. Our restaurant offers a variety of delicious options.</p>
          </div>
        </div>
        <div className="flex items-start">
          <i className="fas fa-volume-mute text-[#6dcf94] text-2xl mr-3"></i>
          <div>
            <h4 className="font-bold text-[#0a4b78] mb-1">No Personal Speakers</h4>
            <p className="text-gray-600">Resort music is available throughout the park for everyone's enjoyment.</p>
          </div>
        </div>
        <div className="flex items-start">
          <i className="fas fa-clock text-[#6dcf94] text-2xl mr-3"></i>
          <div>
            <h4 className="font-bold text-[#0a4b78] mb-1">Operating Hours</h4>
            <p className="text-gray-600">Open from 10:00 AM to 7:00 PM daily. Last entry at 5:00 PM.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
