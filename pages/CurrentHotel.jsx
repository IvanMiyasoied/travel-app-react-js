export const CurrentHotel = ({ elem }) => {
  return (
    <div className="currentHotel-content">
      <h2 className="currentHotel-name">{elem.name}</h2>
      <div className="currentHotel-name-icon-content">
        <div className="currentHotel-name-icon-c">
          <img className="currentHotel-icon" src="" alt="" />
          <p className="currentHotel-text">{elem.country}</p>
        </div>
        <div className="currentHotel-name-icon-c">
          <img className="currentHotel-flag" src="" alt="" />
          <p className="currentHotel-city">{elem.city}</p>
        </div>
      </div>
      <img className="currentHotel-img" src="" alt="" />
      <h2 className="currentHotel-desc-title">Опис</h2>
      <p className="currentHotel-desc-text">{elem.description}</p>
      <h2 className="currentHotel-desc-title">Сервіс</h2>

      <div className="currentHotel-name-icon-content">
        <div className="currentHotel-name-icon-c">
          <img className="currentHotel-icon" src="" alt="" />
          <p className="currentHotel-text">WI-FI</p>
        </div>
        <div className="currentHotel-name-icon-c">
          <img className="currentHotel-icon" src="" alt="" />
          <p className="currentHotel-text">Басейн</p>
        </div>
        <div className="currentHotel-name-icon-c">
          <img className="currentHotel-icon" src="" alt="" />
          <p className="currentHotel-text">Харчування</p>
        </div>
      </div>
      <div className="currentHotel-line"></div>

      <div className="currentHotel-name-icon-c">
        <img className="currentHotel-icon" src="" alt="" />
        <p className="currentHotel-text">{elem.date}</p>
      </div>

      <div className="currentHotel-price-block">
        <p className="currentHotel-price">{elem.price} грн</p>
        <button className="currentHotel-booking-btn">Відкрити ціну</button>
      </div>
    </div>
  );
};
