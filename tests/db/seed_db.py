import random

from django.contrib.auth.models import User
from faker import Faker

from profiles.models import Profile
from skills.models import Skill
from skillsets.models import Skillset

faker = Faker()
faker.seed(10)


def seed_db():
    add_skillsets()
    add_skills()
    add_users()
    add_profiles()
    add_profile_skillsets()


def get_parsed_address():
    address = faker.address().split(" ")
    zipcode = address[-1]
    state = address[-2]
    city = address[-3].split("\n")
    street = city[0]
    city = city[-1].replace(",", "")
    street = ' '.join(address[0:-3]) + ' ' + street
    return street, city, state, zipcode


def add_skillsets():
    skillsets = [
        'JavaScript', 'Python', 'Ruby', 'Java', 'GO', 'Perl', 'C++', 'C',
        'Objective C', 'Swift', 'Algorithms', 'Data Structures',
        'Machine Learning', 'SQL', 'NOSQL', 'Big Data'
    ]
    for x in range(len(skillsets)):
        Skillset.objects.create(name=skillsets[x], description=faker.text(),
                                verified=bool(random.getrandbits(1)))


def add_skills():
    skillsets = Skillset.objects.all()
    for skillset in skillsets:
        for x in range(10):
            Skill.objects.create(skillset=skillset, name=faker.company(),
                                 description=faker.text(),
                                 verified=True)
        for x in range(10):
            Skill.objects.create(skillset=skillset, name=faker.company(),
                                 description=faker.text(),
                                 verified=False)


def add_users():
    for x in range(20):
        User.objects.create(username=faker.email(), password=faker.password())


def add_profiles():
    users = User.objects.all()
    for user in users:
        Profile.objects.create(user=user, title=faker.job(),
                               description=faker.text(),
                               years_experience=random.randrange(1, 10))


def add_profile_skillsets():
    profiles = Profile.objects.all()
    skillsets = Skillset.objects.all()
    for profile in profiles:
        profile_skillsets = random.sample(skillsets, 8)
        for profile_skillset in profile_skillsets:
            profile_skills = random.sample(profile_skillset.skills, 10)
            profile.skills.add(profile_skills)
            profile.save()


if __name__ == "__main__":
    seed_db()
