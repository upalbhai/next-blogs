import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Example Cards */}
    <Card>
      <CardHeader>
        <CardTitle>Total Posts</CardTitle>
        <CardDescription>123 Published Posts</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">123</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
        <CardDescription>456 Active Users</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">456</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>789 New Comments</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">789</p>
      </CardContent>
    </Card>
  </div>
  )
}

export default Dashboard
