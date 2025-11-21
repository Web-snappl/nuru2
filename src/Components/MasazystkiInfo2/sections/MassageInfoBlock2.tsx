export default function MassageBookingBlock(): React.ReactElement {
  return (
    <div className="flex items-center justify-center py-16 bg-white p-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-light text-[#3E4249] mb-4">
          Umów się na masaż <span className="text-[#3E4249] font-semibold">już dziś!</span>
        </h2>
        <p className="text-[#3E4249] text-xl mb-12 w-[55%] ml-[22.5%]">
          Nie czekaj dłużej na relaks i odprężenie. Zarezerwuj swoją wizytę z jedną z naszych profesjonalnych masażystek już teraz!
        </p>
        <button className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-md w-fit">Umów się na wizytę</button>
      </div>
    </div>
  );
}