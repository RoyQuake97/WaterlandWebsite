import { useQuery } from "@tanstack/react-query";

const AnnouncementBar = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/site-settings'],
  });

  // Don't show announcement bar if no announcement or if it's disabled
  if (isLoading || !data || !data.showAnnouncement || !data.announcementText) {
    return null;
  }

  return (
    <div className="bg-[#0a4b78] text-white text-center py-2 px-4">
      <p className="text-sm font-medium">{data.announcementText}</p>
    </div>
  );
};

export default AnnouncementBar;
