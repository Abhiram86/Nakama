import bg from "../assets/bg_6.png";

export default function PleaseSelect() {
  return (
    <div className="sm:ml-80 md:ml-[25rem] h-[calc(100vh-8.5rem)] flex flex-col justify-center items-center">
      <img src={bg} alt="chopper" />
      <p className="text-xl font-sans">Please select a group</p>
    </div>
  );
}
