export default function MassageInfoBlock() {
  return (
    <div className="flex items-center justify-center py-12 sm:py-16 bg-white text-[#3E4249] px-4 sm:px-6">
      <div className="w-full max-w-2xl text-center">
        <p className="text-xs sm:text-sm text-[#3E4249] mb-2">Masaż</p>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-[#3E4249] mb-4 sm:mb-6">
          Dlaczego warto <span className="font-semibold">regularnie</span> korzystać z usług masażu
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#3E4249] mb-8 sm:mb-12">
          Regularny masaż przynosi wiele korzyści dla zdrowia i samopoczucia.
          Pomaga w redukcji stresu, poprawia krążenie oraz łagodzi bóle mięśniowe.
          Dodatkowo, masaż wspiera regenerację organizmu i zwiększa elastyczność ciała.
        </p>
      </div>
    </div>
  );
}
