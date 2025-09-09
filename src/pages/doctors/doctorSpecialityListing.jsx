import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DoctorCard } from "./component/doctor-card";
import { PageHeader } from "../../components/page-header";
import { getDoctorBySpeciality } from "../../actions/doctorListing";

const DoctorSpecialtyPage = () => {
    const { speciality } = useParams(); 
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);

      useEffect(() => {
        if (!speciality) {
          navigate("/doctors"); // redirect if no speciality
          return;
        }

        const fetchDoctors = async () => {
          try {
            const { doctors, error } = await getDoctorBySpeciality(speciality);
            if (error) setError(error);
            else setDoctors(doctors);
          } catch (err) {
            console.error("Error fetching doctors:", err);
            setError(err.message);
          }
        };

        fetchDoctors();
      }, [speciality, navigate]);

    return (
        <div className="container mx-auto my-20">
                <div className="space-y-5">
                    <PageHeader
                        title={speciality?.split("%20").join(" ")}
                        backLink="/doctors"
                        backLabel="All Specialties"
                    />

                    {doctors && doctors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {doctors.map((doctor) => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium text-white mb-2">
                                No doctors available
                            </h3>
                            <p className="text-muted-foreground">
                                There are currently no verified doctors in this specialty. Please
                                check back later or choose another specialty.
                            </p>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default DoctorSpecialtyPage;
