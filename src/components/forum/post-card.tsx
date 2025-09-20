import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { type Post } from "@/lib/types";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          <span>By {post.author}</span> &bull; <span>{post.timestamp}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments} comments</span>
        </div>
      </CardFooter>
    </Card>
  );
}
