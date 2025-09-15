import json
from channels.generic.websocket import AsyncWebsocketConsumer

class VoteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Each poll will have its own group so that only people
        subscribed to a poll receive live updates.
        """
        self.poll_id = self.scope['url_route']['kwargs']['poll_id']
        self.group_name = f"poll_{self.poll_id}_votes"

        # Join the group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def vote_message(self, event):
        """
        Send message to WebSocket
        """
        await self.send(text_data=json.dumps(event["data"]))
