# # votes/utils.py
# from candidates.models import Candidate
# from polls.models import Poll, PollOption
# from votes.models import Vote

# def get_poll_results(poll):
#     option_results = []
#     for option in PollOption.objects.filter(poll=poll):
#         count = Vote.objects.filter(poll=poll, option=option).count()
#         option_results.append({
#             "option_id": option.option_id,
#             "option_text": option.option_text,
#             "votes": count,
#         })

#     candidate_results = []
#     for candidate in Candidate.objects.filter(poll=poll):
#         count = Vote.objects.filter(poll=poll, candidate=candidate).count()
#         candidate_results.append({
#             "candidate_id": candidate.candidate_id,
#             "full_name": candidate.full_name,
#             "votes": count,
#         })

#     return {
#         "poll_id": poll.poll_id,
#         "title": poll.title,
#         "total_votes": Vote.objects.filter(poll=poll).count(),
#         "options": option_results,
#         "candidates": candidate_results,
#     }


# votes/utils.py

def get_poll_results(poll):
    # 🔑 Import models here instead of top-level
    from candidates.models import Candidate
    from polls.models import PollOption
    from votes.models import Vote

    option_results = []
    for option in PollOption.objects.filter(poll=poll):
        count = Vote.objects.filter(poll=poll, option=option).count()
        option_results.append({
            "option_id": option.option_id,
            "option_text": option.option_text,
            "votes": count,
        })

    candidate_results = []
    for candidate in Candidate.objects.filter(poll=poll):
        count = Vote.objects.filter(poll=poll, candidate=candidate).count()
        candidate_results.append({
            "candidate_id": candidate.candidate_id,
            "full_name": candidate.full_name,
            "votes": count,
        })

    return {
        "poll_id": poll.poll_id,
        "title": poll.title,
        "total_votes": Vote.objects.filter(poll=poll).count(),
        "options": option_results,
        "candidates": candidate_results,
    }
