# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
WorkoutType.find_or_create_by(id: 0, name: 'run')
WorkoutType.find_or_create_by(id: 1, name: 'race')
WorkoutType.find_or_create_by(id: 2, name: 'long run')
WorkoutType.find_or_create_by(id: 3, name: 'workout')

BestEffortType.find_or_create_by(name: '50k')
BestEffortType.find_or_create_by(name: 'Marathon')
BestEffortType.find_or_create_by(name: 'Half Marathon')
BestEffortType.find_or_create_by(name: '30k')
BestEffortType.find_or_create_by(name: '20k')
BestEffortType.find_or_create_by(name: '10 mile')
BestEffortType.find_or_create_by(name: '15k')
BestEffortType.find_or_create_by(name: '10k')
BestEffortType.find_or_create_by(name: '5k')
BestEffortType.find_or_create_by(name: '2 mile')
BestEffortType.find_or_create_by(name: '1 mile')
BestEffortType.find_or_create_by(name: '1k')
BestEffortType.find_or_create_by(name: '1/2 mile')
BestEffortType.find_or_create_by(name: '400m')

RaceDistance.find_or_create_by(id: 0, distance: 0, name: 'Other Distances')
RaceDistance.find_or_create_by(distance: 1609, name: '1 mile')
RaceDistance.find_or_create_by(distance: 3000, name: '3000m')
RaceDistance.find_or_create_by(distance: 5000, name: '5k')
RaceDistance.find_or_create_by(distance: 10_000, name: '10k')
RaceDistance.find_or_create_by(distance: 15_000, name: '15k')
RaceDistance.find_or_create_by(distance: 20_000, name: '20k')
RaceDistance.find_or_create_by(distance: 21_097, name: 'Half Marathon')
RaceDistance.find_or_create_by(distance: 42_195, name: 'Marathon')
RaceDistance.find_or_create_by(distance: 50_000, name: '50k')
RaceDistance.find_or_create_by(distance: 80_467, name: '50 miles')
RaceDistance.find_or_create_by(distance: 100_000, name: '100k')
RaceDistance.find_or_create_by(distance: 160_934, name: '100 miles')

SubscriptionPlan.find_or_create_by(amount: 0, name: 'Early Birds PRO', description: 'Early Birds PRO Plan')
SubscriptionPlan.find_or_create_by(amount: 0, name: 'Lifetime PRO', description: 'Lifetime PRO Plan')
