
"use client"
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
const Page =  () => {
  const [value, setvalue] = useState("");
  const trpc = useTRPC();
  const { data: message } = useQuery(trpc.messages.getMany.queryOptions())
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message created");
    }
  }));
  return(
    <div className= "p-4 max-w-7xl mx-auto">
      <Input value = {value} onChange={(e) => setvalue(e.target.value)}/>
      <Button 
      disabled={createMessage.isPending} 
      onClick={() => createMessage.mutate({ value: value })}>
        Create Message
      </Button>
      {JSON.stringify(message, null, 2)}
    </div>
  );
  
};
export default Page;