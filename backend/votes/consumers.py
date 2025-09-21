
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async


class VoteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.poll_id = self.scope['url_route']['kwargs']['poll_id']
        self.group_name = f"poll_{self.poll_id}_votes"

        print(f"🔗 WebSocket connected for poll {self.poll_id}")

        # Join group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # ✅ Lazy import inside connect
        from polls.models import Poll
        from votes.models import Vote
        from votes.utils import get_poll_results

        poll = await sync_to_async(Poll.objects.get)(pk=self.poll_id)
        results = await sync_to_async(get_poll_results)(poll)
        total_votes = await sync_to_async(Vote.objects.filter(poll=poll).count)()

        await self.send(text_data=json.dumps({
            "poll_id": self.poll_id,
            "title": poll.title,
            "total_votes": total_votes,
            "options": results.get("options", []),
            "candidates": results.get("candidates", []),
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"❌ WebSocket disconnected from poll {self.poll_id}")

    async def vote_message(self, event):
        # ✅ Forward results exactly as sent from views
        await self.send(text_data=json.dumps(event["data"]))
