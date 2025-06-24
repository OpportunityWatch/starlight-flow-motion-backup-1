
import NightSkyBackground from "../components/NightSkyBackground";

const Index = () => {
  return (
    <>
      <NightSkyBackground />
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Starlit App</h1>
          <p className="text-xl text-white/80">Experience the beauty of the night sky</p>
        </div>
      </div>
    </>
  );
};

export default Index;
