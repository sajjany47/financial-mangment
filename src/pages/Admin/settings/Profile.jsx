import { useEffect, useState } from "react";
import { getDetails } from "../Employee/AddUserService";
import Loader from "../../../component/Loader";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../../shared/constant";

const Profile = () => {
  const userDetails = useSelector((state) => state.user?.user.data);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDetails(userDetails._id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loading && <Loader />}
      <section className="surface-section w-full overflow-hidden">
        {/* Profile Image */}
        <div className="sm:w-8 xs:w-9  flex gap-4">
          <img
            src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxwZW9wbGV8ZW58MHwwfHx8MTcxMTExMTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080"
            alt="User Profile"
            className="border-round-md outline outline-2 outline-offset-2 outline-primary lg:w-12rem lg:h-12rem md:w-10rem md:h-10rem sm:w-8rem sm:h-8rem xs:w-7rem xs:h-7rem relative lg:bottom-5rem sm:bottom-4rem xs:bottom-3rem"
          />
          {/* FullName */}
          <div>
            <h1 className=" text-start mt-2 sm:ml-4 xs:pl-4 text-gray-800 lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-bold">
              {data.name}
            </h1>
            <h3 className="ml-5">{capitalizeFirstLetter(data.position)}</h3>
          </div>
        </div>
        <div className="xl:w-8 lg:w-9 md:w-9 sm:w-9 xs:w-9  flex flex-column gap-4 align-items-center relative lg:top-8 md:top-6 sm:top-4 xs:top-4">
          {/* Detail */}
          <div className="w-full py-1 flex flex-column gap-2 align-items-center">
            <div className="w-full flex sm:flex-row xs:flex-column gap-2 justify-content-center">
              <div className="w-full">
                <dl className="text-gray-900">
                  <div className="flex flex-column pb-3">
                    <div className="mb-1 text-500">First Name</div>
                    <div className="font-semibold">Samuel</div>
                  </div>
                  <div className="flex flex-column py-3">
                    <dt className="mb-1 text-500">Last Name</dt>
                    <dd className="font-semibold">Abera</dd>
                  </div>
                  <div className="flex flex-column py-3">
                    <dt className="mb-1 text-500">Date Of Birth</dt>
                    <dd className="font-semibold">21/02/1997</dd>
                  </div>
                  <div className="flex flex-column py-3">
                    <dt className="mb-1 text-500">Gender</dt>
                    <dd className="font-semibold">Male</dd>
                  </div>
                </dl>
              </div>
              <div className="w-full">
                <dl className="text-gray-900">
                  <div className="flex flex-column pb-3">
                    <dt className="mb-1 text-500">Location</dt>
                    <dd className="font-semibold">Ethiopia, Addis Ababa</dd>
                  </div>
                  <div className="flex flex-column pt-3">
                    <dt className="mb-1 text-500">Phone Number</dt>
                    <dd className="font-semibold">+251913****30</dd>
                  </div>
                  <div className="flex flex-column pt-3">
                    <dt className="mb-1 text-500">Email</dt>
                    <dd className="font-semibold">samuelabera87@gmail.com</dd>
                  </div>
                  <div className="flex flex-column pt-3">
                    <dt className="mb-1 text-500">Website</dt>
                    <dd className="font-semibold">
                      <a href="https://techakim.com" className="text-primary">
                        https://www.teclick.com
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
