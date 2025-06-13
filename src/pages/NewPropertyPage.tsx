
import StorageBuckets from "@/components/admin/StorageBuckets";
import PropertyForm from "@/components/property/PropertyForm";
import { PropertyPageHeader } from "@/components/property/PropertyPageHeader";

const NewPropertyPage = () => {
  return (
    <>
      <StorageBuckets />
      <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <PropertyPageHeader />
            <PropertyForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPropertyPage;
