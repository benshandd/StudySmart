import UploadDocument from "./UploadDocument";

const page = () => {
  return (
    <div className="flex flex-col flex-grow-1">
      <main className="py-11 flex flex-col text-center gap-4 items-center flex-1 mt-24">
        <h2 className="text-3xl font-bold mb-4">
          What do you want to be quizzed on today?
        </h2>
        <UploadDocument></UploadDocument>
      </main>
    </div>
  );
};

export default page;
