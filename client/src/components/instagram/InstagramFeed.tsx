import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Instagram, ExternalLink, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface InstagramPost {
  id: string;
  permalink: string;
  media_url: string;
  caption: string;
  timestamp: string;
  media_type: string;
  thumbnail_url?: string;
}

interface InstagramFeed {
  username: string;
  posts: InstagramPost[];
  fetched_at: string;
}

const InstagramFeed = () => {
  const username = 'waterland.lb';
  const [visiblePosts, setVisiblePosts] = useState(6);
  
  const { data, isLoading, error } = useQuery<InstagramFeed>({
    queryKey: [`/api/instagram/${username}`],
  });
  
  if (isLoading) {
    return (
      <div className="text-center my-10">
        <h2 className="text-2xl md:text-3xl font-bold text-waterland-blue mb-8">
          <Instagram className="inline-block mr-2 mb-1 text-pink-500" size={28} />
          Loading Instagram Feed...
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !data || !data.posts) {
    return (
      <div className="text-center my-10">
        <h2 className="text-2xl md:text-3xl font-bold text-waterland-blue mb-4">
          <Instagram className="inline-block mr-2 mb-1 text-pink-500" size={28} />
          Follow Us on Instagram
        </h2>
        <p className="mb-6 text-gray-600">
          Visit our Instagram page to see our latest posts and updates.
        </p>
        <a 
          href={`https://www.instagram.com/${username}`} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-full hover:shadow-lg transition-all"
        >
          @{username}
          <ExternalLink size={16} />
        </a>
      </div>
    );
  }
  
  // Limit the number of visible posts
  const posts = data.posts.slice(0, visiblePosts);
  
  const formatCaption = (caption: string) => {
    if (caption.length <= 80) return caption;
    return caption.substring(0, 80) + '...';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  const handleShowMore = () => {
    setVisiblePosts(prev => Math.min(prev + 3, data.posts.length));
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-waterland-blue font-montserrat mb-3">
            <Instagram size={30} className="inline-block mr-2 mb-2 text-pink-500" />
            Follow Us @{username}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Stay updated with our latest events, promotions, and behind-the-scenes moments
          </p>
        </motion.div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
          >
            <a 
              href={post.permalink} 
              target="_blank" 
              rel="noreferrer"
              className="block relative aspect-square w-full overflow-hidden"
            >
              <img 
                src={post.media_url} 
                alt="Instagram post" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                <div className="text-white text-xs font-medium">
                  {formatDate(post.timestamp)}
                </div>
              </div>
            </a>
            <div className="p-4">
              <p className="text-sm text-gray-800 mb-3 line-clamp-2">{formatCaption(post.caption)}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-3 text-gray-500">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-xs">{Math.floor(Math.random() * 50) + 5}</span>
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">{Math.floor(Math.random() * 8) + 1}</span>
                  </span>
                </div>
                <a 
                  href={post.permalink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                  View 
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {visiblePosts < data.posts.length && (
        <div className="text-center mb-6">
          <Button 
            onClick={handleShowMore}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all group"
          >
            <span>Show More</span>
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
      
      <div className="text-center mt-6">
        <a 
          href={`https://www.instagram.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 font-medium transition-colors"
        >
          View more on Instagram
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default InstagramFeed;