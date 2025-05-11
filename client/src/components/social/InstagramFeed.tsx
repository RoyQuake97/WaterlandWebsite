import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type InstagramPost = {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  media_type: string;
  thumbnail_url?: string;
};

interface InstagramFeed {
  username: string;
  posts: InstagramPost[];
  fetched_at: string;
}

const InstagramFeed = () => {
  const username = 'waterland.lb';
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  const { data, isLoading, error } = useQuery<InstagramFeed>({
    queryKey: [`/api/instagram/${username}`],
    retry: 1,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Update posts when data changes
  useEffect(() => {
    if (data?.posts) {
      setPosts(data.posts);
    }
  }, [data]);

  // Animation variants
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCaption = (caption: string) => {
    if (caption.length <= 100) return caption;
    return `${caption.substring(0, 100)}...`;
  };

  return (
    <div>
      <div className="text-center mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Instagram size={30} className="text-[#E1306C]" />
          <h2 className="text-3xl md:text-4xl font-bold text-waterland-blue font-montserrat">Follow Us @{username}</h2>
        </motion.div>
        <motion.p 
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Stay updated with our latest events, promotions, and behind-the-scenes moments
        </motion.p>
        <motion.a 
          href={`https://www.instagram.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-[#E1306C] hover:text-[#C13584] font-medium transition duration-300 ease-in-out mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span>Follow us on Instagram</span>
          <ExternalLink size={18} className="ml-1" />
        </motion.a>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index}
              className="aspect-square bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-500">
            Unable to load Instagram feed. Please try again later or{' '}
            <a 
              href={`https://www.instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-700 underline"
            >
              visit our Instagram page
            </a>.
          </p>
        </div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {posts.map((post) => (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block overflow-hidden rounded-md aspect-square group"
                variants={itemVariants}
              >
                <img 
                  src={post.media_url} 
                  alt={post.caption || "Instagram post"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white text-sm line-clamp-3">{formatCaption(post.caption)}</p>
                  <span className="text-white/70 text-xs mt-1">{formatDate(post.timestamp)}</span>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {data?.fetched_at && (
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Last updated: {new Date(data.fetched_at).toLocaleString()}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstagramFeed;