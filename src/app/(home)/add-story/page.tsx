import FormAddStory from '@/components/view/add-story/FormAddStory';

export default async function AddStory() {
  return (
    <div className="bg-[url(/nature.jpg)] bg-cover bg-center m-3 h-200 rounded-2xl">
      <div className="min-h-screen pt-25 px-5 container mx-auto ">
        <div className="justify-center flex mx-auto">
          <FormAddStory />
        </div>
      </div>
    </div>
  );
}
