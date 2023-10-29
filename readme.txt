# claim
  I have (I think) done all tasks
  T1
  T2
  T3(a,b,c,d)
  T4

# tested environments
  m1 macbook macOS 14 + chrome 118 arm64 + python http.server

# additional and general remarks
  I tried to track the scale seperately from the transform+rotate matrix so that the speeds are consistent regardless of scale when moving,
  however I did not manage to get the local and global scale to work properly with this approach
  thats why I introduced yet another scale matrix (one for local and one for global scale) and magically got it working by applying them
  in a specific order in the draw function of my shape class
  
  I am sure this is not the right way to do it, but I wasn not able to figure out how to get it working any other way