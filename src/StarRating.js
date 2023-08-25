const ContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const StarContainerStyle = {
  display: "flex",
  gap: "4px",
};

const Text = {
  lineHeight: "1",
  margin: "0",
};
const StarRating = () => {
  return (
    <div style={ContainerStyle}>
      <div style={StarContainerStyle}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>S[i+1]</span>
        ))}
      </div>
      <p style={Text}>10</p>
    </div>
  );
};

export default StarRating;
