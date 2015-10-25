package com.ociweb.carmaStationSimulator;

import com.ociweb.pronghorn.adapter.netty.WebSocketSchema;
import com.ociweb.pronghorn.pipe.Pipe;
import com.ociweb.pronghorn.pipe.PipeReader;
import com.ociweb.pronghorn.pipe.PipeWriter;
import com.ociweb.pronghorn.stage.PronghornStage;
import com.ociweb.pronghorn.stage.scheduling.GraphManager;

public class WebSocketInterfaceStage extends PronghornStage{

    
    private final Pipe<WebSocketSchema> input;
    private final Pipe<WebSocketSchema> output;
    
    public WebSocketInterfaceStage(GraphManager gm, Pipe<WebSocketSchema> input, Pipe<WebSocketSchema> output) {
       super(gm, input, output);
       
       this.input = input;
       this.output = output;
       
    }

    @Override
    public void startup() {
        //do any new allocations here
        //this method is allowed to block as needed on external resources
    }
    
    
    @Override
    public void run() {
        //This method must never block, it must do the next thing and return
        //if the next thing can not be done then state must be held in this object so it can try again upon the next call.
        while (PipeReader.tryReadFragment(input)) {
            
            //This value is required for sending the response back to the right browser instance which sent this message
            long channelId = PipeReader.readLong(input, WebSocketSchema.fieldForSingleChannelMessageChannelId);
            
            //this is rather verbose but needed because the bytes are inside the pipe and we want to read them in-place
            int pos = PipeReader.readBytesPosition(input, WebSocketSchema.fieldForSingleChannelMessagePayload);
            int len = PipeReader.readBytesLength(input, WebSocketSchema.fieldForSingleChannelMessagePayload);
            int mask = PipeReader.readBytesMask(input, WebSocketSchema.fieldForSingleChannelMessagePayload);
            byte[] payload = PipeReader.readBytesBackingArray(input, WebSocketSchema.fieldForSingleChannelMessagePayload);

            //example of how to read the bytes from the payload
            for(int i = pos; i<(pos+len); i++) { 
                
                byte byteFromAngularApp = payload[mask&i];//do not forget the mask its important.
                //////
                //just dump the messages.
                //////
                
            }
            
            PipeReader.releaseReadLock(input); //read will not release space on pipe until this is called.
            
        }
        
        
        //example of write
        if (PipeWriter.tryWriteFragment(output, WebSocketSchema.forSingleChannelMessageIdx)) {
            //there is room so we do the write
            
            long someChannelId = 77777; //we got this from the request message to tell us which browser to send this back to.
            PipeWriter.writeLong(output, WebSocketSchema.fieldForSingleChannelMessageChannelId, someChannelId);
            
            byte[] payload = new byte[] {1,2,3,4};//some bytes to send back to the angular app
            PipeWriter.writeBytes(output, WebSocketSchema.fieldForSingleChannelMessagePayload, payload);
            
            PipeWriter.publishWrites(output); //message is not sent on pipe until after this is called.
        }
        
        
        
    }
    
    @Override
    public void shutdown() {
        //release any resources before shutdown
        //this method is allowed to block as needed on external resources
        
    }
    

}
